import { BrandMark } from './BrandMark';

export function ProductBrand() {
  return <span className="product-brand">
    <span className="brand-mark"><BrandMark /></span>
    <span className="brand-name">nhịp tập</span>
  </span>;
}
