import { getApiDocs } from '../../lib/swagger';
import ReactScalar from './react-scalar';

export default async function Page() {
  const spec = await getApiDocs();
  return (
    <section>
      <ReactScalar spec={spec} />
    </section>
  );
}
