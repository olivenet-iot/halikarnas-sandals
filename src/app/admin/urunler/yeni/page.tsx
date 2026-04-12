import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün</h1>
        <p className="text-gray-500 mt-1">
          Yeni bir ürün oluşturun
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
