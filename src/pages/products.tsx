import axios from 'axios';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export default function Products() {
  const [data, setData] = useState<
    { id: number; name: string; price: number }[]
  >([]);

  useEffect(() => {
    const fetcher = async () => {
      const response = await axios.get('http://localhost:8080/products');
      setData(response.data);
    };

    fetcher();
  }, []);


  const handleAddToCart = async (id: number) => {
    const response = await axiosInstance.post('http://localhost:8080/cart', {
      productId: id,
    },);

    console.log(response.data);
  };

  return (
    <div>
      <h1>products</h1>

      <div>
        {data.map((product) => (
          <div key={product.id}>
            {product.name}

            <button
              className="bg-green-400 hover:bg-green-800 disabled:opacity-50"
              onClick={() => handleAddToCart(product.id)}
            >
              add to cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
