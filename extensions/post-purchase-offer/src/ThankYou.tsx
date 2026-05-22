import {
  Badge,
  Banner,
  BlockStack,
  Button,
  Divider,
  Heading,
  Image,
  InlineLayout,
  InlineStack,
  Spinner,
  Text,
  View,
  reactExtension,
  useApi,
  useSubscription,
} from '@shopify/ui-extensions-react/checkout';
import {useEffect, useMemo, useState} from 'react';
import {matchOffer, resolveApiUrl, trackClick, trackImpression} from './extension-api';
import type {MatchOfferResponse} from './types';

export default reactExtension('purchase.thank-you.block.render', () => <ThankYouOffer />);

function ThankYouOffer() {
  const api = useApi<'purchase.thank-you.block.render'>();
  const lines = useSubscription(api.lines);
  const cost = useSubscription(api.cost.totalAmount);
  const orderConfirmation = useSubscription(api.orderConfirmation);
  const checkoutToken = useSubscription(api.checkoutToken);
  const selectedPaymentOptions = useSubscription(api.selectedPaymentOptions);
  const settings = useSubscription(api.settings) as Record<string, unknown>;
  const [state, setState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [offer, setOffer] = useState<NonNullable<MatchOfferResponse['offer']> | null>(null);
  const [sessionToken, setSessionToken] = useState<string>();
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);

  const apiUrl = useMemo(() => resolveApiUrl(settings), [settings]);
  const shopDomain = api.shop.myshopifyDomain;
  const order = orderConfirmation as unknown as {
    id?: string;
    number?: string;
    customer?: {isFirstOrder?: boolean};
  };
  const orderId = order?.id ?? order?.number;
  const customerType = order?.customer?.isFirstOrder ? 'first_time' : 'returning';

  useEffect(() => {
    let mounted = true;

    async function loadOffer() {
      try {
        setState('loading');
        const token = await api.sessionToken.get();
        const products = lines.map((line) => {
          const merchandise = line.merchandise as {id?: string; product?: {id?: string}};
          return merchandise.product?.id ?? merchandise.id;
        });

        const response = await matchOffer(apiUrl, token, {
          shop: shopDomain,
          orderId,
          products,
          collections: [],
          orderValue: Number(cost.amount),
          customerType,
          paymentType: selectedPaymentOptions?.[0]?.type ?? selectedPaymentOptions?.[0]?.handle,
          checkoutToken,
        });

        if (!mounted) return;
        setSessionToken(token);
        setOffer(response.offer);
        setSecondsRemaining((response.offer?.content.timerMinutes ?? 15) * 60);
        setState(response.offer ? 'ready' : 'empty');
      } catch (error) {
        console.error(error);
        if (mounted) setState('error');
      }
    }

    loadOffer();
    return () => {
      mounted = false;
    };
  }, [api.sessionToken, apiUrl, checkoutToken, cost.amount, customerType, lines, orderId, selectedPaymentOptions, shopDomain]);

  useEffect(() => {
    if (!offer) return;
    trackImpression(apiUrl, sessionToken, {
      shop: shopDomain,
      campaignId: offer.campaignId,
      orderId,
      checkoutToken,
      customerType,
    }).catch((error) => console.error(error));
  }, [apiUrl, checkoutToken, customerType, offer, orderId, sessionToken, shopDomain]);

  useEffect(() => {
    if (!offer?.content.timerEnabled) return;
    const timer = setInterval(() => setSecondsRemaining((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [offer?.content.timerEnabled]);

  if (state === 'loading') {
    return (
      <View border="base" padding="base">
        <InlineStack spacing="base" blockAlignment="center">
          <Spinner />
          <Text>Loading private offer</Text>
        </InlineStack>
      </View>
    );
  }

  if (state === 'empty') return null;

  if (state === 'error' || !offer) {
    return (
      <Banner status="warning" title="Offer unavailable">
        <Text>Your order is confirmed. This private offer could not be loaded.</Text>
      </Banner>
    );
  }

  const discountedPrice = Math.max(0, offer.product.price - calculateDiscountAmount(offer));
  const minutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsRemaining % 60).toString().padStart(2, '0');
  const image = offer.product.image || (settings.fallback_product_image as string | undefined);

  return (
    <View border="base" padding="base">
      <BlockStack spacing="base">
        <InlineStack inlineAlignment="center">
          <Badge tone="critical">{discountLabel(offer.discount.type, offer.discount.value)}</Badge>
        </InlineStack>

        <BlockStack spacing="tight" inlineAlignment="center">
          <Heading level={2}>{offer.content.headline}</Heading>
          <Text appearance="subdued">{offer.content.subheadline}</Text>
        </BlockStack>

        <InlineLayout columns={['35%', 'fill']} spacing="base" blockAlignment="center">
          {image ? <Image source={image} accessibilityDescription={offer.product.title} /> : <View border="base" />}

          <BlockStack spacing="tight">
            <Heading level={3}>{offer.product.title}</Heading>
            {offer.product.description ? <Text appearance="subdued">{offer.product.description}</Text> : null}
            <InlineStack spacing="tight" blockAlignment="center">
              {offer.design.showComparePrice && offer.product.compareAtPrice ? (
                <Text appearance="subdued">₹{offer.product.compareAtPrice.toLocaleString('en-IN')}</Text>
              ) : null}
              <Text emphasis="bold">₹{discountedPrice.toLocaleString('en-IN')}</Text>
            </InlineStack>
          </BlockStack>
        </InlineLayout>

        <Divider />

        <BlockStack spacing="tight">
          {offer.content.urgencyText ? <Text emphasis="bold">{offer.content.urgencyText}</Text> : null}
          {offer.content.timerEnabled ? (
            <Text appearance="subdued">
              Offer expires in {minutes}:{seconds}
            </Text>
          ) : null}
        </BlockStack>

        <Button
          kind="primary"
          to={offer.redirectUrl}
          onPress={() => {
            trackClick(apiUrl, sessionToken, {
              shop: shopDomain,
              campaignId: offer.campaignId,
              orderId,
              checkoutToken,
              customerType,
              redirectUrl: offer.redirectUrl,
            }).catch((error) => console.error(error));
          }}
        >
          {offer.content.ctaText}
        </Button>

        {offer.design.showTrustBadges ? (
          <InlineStack spacing="base" inlineAlignment="center">
            <Text appearance="subdued">Secure checkout</Text>
            <Text appearance="subdued">Private discount</Text>
            <Text appearance="subdued">Shopify protected</Text>
          </InlineStack>
        ) : null}
      </BlockStack>
    </View>
  );
}

function calculateDiscountAmount(offer: NonNullable<MatchOfferResponse['offer']>) {
  if (offer.discount.type === 'PERCENTAGE') {
    return (offer.product.price * offer.discount.value) / 100;
  }

  if (offer.discount.type === 'FIXED_AMOUNT') {
    return offer.discount.value;
  }

  return 0;
}

function discountLabel(type: string, value: number) {
  if (type === 'PERCENTAGE') return `${value}% OFF`;
  if (type === 'FIXED_AMOUNT') return `₹${value} OFF`;
  if (type === 'FREE_SHIPPING') return 'FREE SHIPPING';
  return 'PRIVATE OFFER';
}
