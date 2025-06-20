import { NextPageContext } from 'next';
import Layout from '../components/Layout';

interface Props {
  statusCode?: number;
}

function ErrorPage({ statusCode }: Props) {
  return (
    <Layout title="Error">
      <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
      {statusCode && <p>Status Code: {statusCode}</p>}
      <p>Please try again later.</p>
    </Layout>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode;
  return { statusCode };
};

export default ErrorPage;
