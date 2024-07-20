import axios from 'axios';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export default function Cart() {
    const [data, setData] = useState<{ id: number; name: string; price: number }[]>([]);
  useEffect(() => {
    const fetcher = async () => {
      const response = await axiosInstance.get(
        'http://localhost:8080/cart'
      );
      setData(response.data);
    };

    fetcher();
  }, []);

  return <div> {data.map((product) => (
    <div key={product.id}>
      {product.name}
    </div>
  ))}</div>;
}
