import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getDeliveryThunk } from "../../redux/deliveries"
import OpenModalButton from '../OpenModalButton'
import './DeliveryDetails.css'

import MessageContainer from '../MessageContainer'
import DeleteModal from "../DeleteModal"
import MapComponent from "../Map"
import {
  setKey,
  fromAddress
} from 'react-geocode'

export default function DeliveryDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const delivery = useSelector(state => state.deliveries[id])
  const key = useSelector(state => state.apiKeys.apiKey)
  const [pickupMarker, setPickupMarker] = useState({lat: null, lng:null})
  const [dropMarker, setDropMarker] = useState({lat: null, lng:null})
  const [markersLoaded, setMarkersLoaded] = useState(false)



  useEffect(() => {
    dispatch(getDeliveryThunk(id))
  }, [dispatch, id])

  const handleUpdate = () => {
    navigate(`/deliveries/${id}/update`)
  }

  // useEffect(() => {
  //   setPickupMarker({ lat: 37.773972, lng: -122.431297 })
  //   setDropMarker({ lat: 37.773972, lng: -122.431297 })
  //   setMarkersLoaded(true)
  // }, [delivery, key])

  useEffect(() => {
    const getMarkers = async () => {
      setKey(key)
      const pickupRes = await fromAddress(`${delivery.pickupAddress} ,${delivery.pickupCity}, ${delivery.pickupState}`)
      const {lat: pickupLat, lng: pickupLng} = pickupRes.results[0].geometry.location
      setPickupMarker({lat: pickupLat, lng: pickupLng})
      const dropRes = await fromAddress(`${delivery.dropAddress} ,${delivery.dropCity}, ${delivery.dropState}`)
      const {lat: dropLat, lng: dropLng} = dropRes.results[0].geometry.location
      setDropMarker({lat: dropLat, lng: dropLng})
      setMarkersLoaded(true)
    }
    if(delivery) getMarkers()
  },[delivery, key])


  if (!delivery) return <h2>Loading</h2>

  return (
    <div className="details-page-container">
    <div className="details-outer-container">
      <div className="details-delivery-container">
        <div className="details-pickup">
          <h2>Delivery Details</h2>
          <h3>Pickup</h3>
          <h3>{delivery.pickupName}</h3>
          <div>{delivery.pickupAddress}</div>
          <div>{delivery.pickupCity}, {delivery.pickupState} {delivery.pickupZip}</div>
        </div>
        <div className="details-drop">
          <h3>Drop off</h3>
          <h3>{delivery.dropName}</h3>
          <div>{delivery.dropAddress}</div>
          <div>{delivery.dropCity}, {delivery.dropState} {delivery.dropZip}</div>
        </div>
        <div className="details-instructions">
          <h3>Description</h3>
          <div>{delivery.description}</div>
          <h3>Special Instructions</h3>
          <div>{delivery.specialInstructions}</div>
          <div className='details-button-container'>
            <span><button onClick={handleUpdate}>Update</button></span>
            <span><OpenModalButton buttonText='Delete' modalComponent={<DeleteModal delivery={delivery} type={'delivery'}/>}/></span>
          </div>
        </div>
      </div>
      <div className="map-placeholder">
        {key && markersLoaded && <MapComponent apiKey={key} pickup={pickupMarker} drop={dropMarker}/>}
      </div>
    </div>
    <div className="messages-container">
    <MessageContainer />
    </div>
    </div>
  )
}
