import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

const RecommendedProductPage = async () => {
  const products = await db.product.findMany({
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <>
      <Header />
      <div className="px-5 py-5">
        <h2 className="mb-6 text-lg font-semibold">Pedidos recomendados</h2>
        <div className="grid grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductItem
              className="min-w-full"
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedProductPage;
