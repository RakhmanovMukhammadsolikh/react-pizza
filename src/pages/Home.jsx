import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import qs from 'qs'
import { useNavigate } from 'react-router-dom'

import { selectFilter, setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice'
import { fetchPizzas, selectPizzaData } from '../redux/slices/pizzaSlice';
import { SearchContext } from '../App';
import { Categories } from '../components/Categories';
import { Sort, sortList } from '../components/Sort';
import { PizzaBlock } from '../components/PizzaBlock';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import { Pagination } from '../components/Pagination';


export const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isSearch = useRef(false)
    const isMounted = useRef(false)

    const { items, status } = useSelector(selectPizzaData)
    const filter = useSelector(selectFilter)
    const { sort, categoryId, currentPage, searchValue } = filter




    const getPizzas = async () => {
        const sortBy = sort?.sortProperty?.replace('-', '');
        const order = sort?.sortProperty?.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `category=${categoryId}` : ''
        const search = searchValue ? `&search=${searchValue}` : ''


        dispatch(fetchPizzas({
            sortBy,
            order,
            category,
            search,
            currentPage
        }))

        window.scrollTo(0, 0)

    }


    useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId: categoryId,
                currentPage: currentPage
            });

            navigate(`?${queryString}`)
        }

        isMounted.current = true
    }, [filter])

    useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1));

            const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty)

            dispatch(
                setFilters({
                    ...params,
                    sort,
                }),
            );
            isSearch.current = true
        }
    }, [])

    useEffect(() => {

        getPizzas()
    }, [filter])



    const pizzas = items
        .map((obj) => <PizzaBlock key={obj.id} {...obj} />)

    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />)

    const onChangeCategory = useCallback((idx) => {
        dispatch(setCategoryId(idx))
    }, [])

    const onChangePage = (page) => {
        dispatch(setCurrentPage(page))
    }

    return (
        <div className='container'>
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={(id) => onChangeCategory(id)} />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {
                status === 'error' ? (
                    <div className='content__error-info'>
                        <h2>Произошла ошибка <span> 🙁</span> </h2>
                        <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже. </p>
                    </div>
                ) : (<div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>)
            }
            <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </div>
    )
}
