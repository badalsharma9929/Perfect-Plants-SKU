import {
  Banner,
  BlockStack,
  Button,
  Text,
  reactExtension,
  useApi,
  useSubscription,
} from '@shopify/ui-extensions-react/customer-account';

export default reactExtension('customer-account.order-status.block.render', () => <OrderStatusOffer />);

function OrderStatusOffer() {
  const api = useApi<'customer-account.order-status.block.render'>();
  const settings = useSubscription(api.settings) as Record<string, unknown>;
  const apiUrl = typeof settings.api_url === 'string' ? settings.api_url : undefined;

  return (
    <Banner>
      <BlockStack spacing="tight">
        <Text emphasis="bold">Private post-purchase offers are active for this store.</Text>
        <Text>Open the latest Thank You page after checkout to claim an eligible product offer.</Text>
        {apiUrl ? <Button to={apiUrl}>Manage offers</Button> : null}
      </BlockStack>
    </Banner>
  );
}
