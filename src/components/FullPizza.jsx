import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export const FullPizza = () => {
    const [pizza, setPizza] = useState()
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchPizza() {
            try {
                const { data } = await axios.get('https://646f268609ff19b12086acd1.mockapi.io/items/' + id);
                setPizza(data)
            } catch (error) {
                alert('Ошибка при получении пиццы!')
                navigate('/')
            }
        }


        fetchPizza()
    }, [])

    if (!pizza) {
        return 'Загрузка ...'
    }

    return (
        <div className='container'>
            <img src={pizza.imageUrl} alt="" />
            <h2>{pizza.title}</h2>
            <h4>{pizza.price} ₽</h4>
        </div>
    )
}
