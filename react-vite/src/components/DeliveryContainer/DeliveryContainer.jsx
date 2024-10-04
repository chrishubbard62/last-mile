import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUnassignedThunk } from "../../redux/deliveries"
import { NavLink } from "react-router-dom"
import DeliveryCard from "./DeliveryCard"

export default function DeliveryContainer() {
  const delData = useSelector(state => state.deliveries)
  const dispatch = useDispatch()
  const unassignedDeliveries = Object.values(delData).filter((delivery) => delivery.courierId === null)

  useEffect(() => {
    dispatch(getUnassignedThunk())
  }, [dispatch])

  return (
    <div>
      <nav className="delivery-nav">
        <ul>
          <li>
          <NavLink className='nav-link' to='/'>Unassigned</NavLink>
          </li>
          <li>
          <NavLink className='nav-link' to='/current'>Current</NavLink>
          </li>
        </ul>
      </nav>
      {unassignedDeliveries.map(delivery => <DeliveryCard key={delivery.id} delivery={delivery}/>)}
    </div>
  )
}
