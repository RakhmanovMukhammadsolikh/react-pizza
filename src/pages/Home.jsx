import React, { useEffect, useState } from 'react'

import { SearchContext } from '../App';
import { Categories } from '../components/Categories';
import { Sort } from '../components/Sort';
import { PizzaBlock } from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import { Pagination } from '../components/Pagination';


export const Home = () => {
    const { searchValue, } = React.useContext(SearchContext)

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [categoryId, setCategoryId] = useState()
    const [sortType, setSortType] = useState({
        name: 'популярности',
        sortProperty: 'rating'
    })


    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue ? `&search=${searchValue}` : ''

    useEffect(() => {

        fetch(`https://646f268609ff19b12086acd1.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search} `)
            .then((res) => {
                return res.json()
            })
            .then((arr) => {
                setItems(arr)
                setIsLoading(false);
            })
    }, [categoryId, sortType, searchValue, currentPage])

    const pizzas = items
        .map((obj) => <PizzaBlock key={obj.id} {...obj} />)

    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />)

    return (
        <div className='container'>
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={(id) => setCategoryId(id)} />
                <Sort value={sortType} onChangeSort={(i) => setSortType(i)} />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">{isLoading ? skeletons : pizzas}</div>
            <Pagination onChangePage={(number) => setCurrentPage(number)} />
        </div>
    )
}
