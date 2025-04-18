"use client"
import React from 'react'
import { Button } from 'antd'
import { countReducer } from './hooks'

const Home = () => {
  const [state, dispatch] = countReducer({ count: 0 })
  return (
      <div className="home-conatiner">
        count:{state.count}
        <Button type="primary" onClick={() => {
          dispatch({ type: 'increment' })
        }}>increment</Button>
        <Button type="primary" onClick={() => {
          dispatch({ type: 'decrement' })
        }}>decrement</Button>
      </div>
  )
}

export default Home