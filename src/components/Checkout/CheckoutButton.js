import React from 'react'
import ReactDOM from 'react-dom'
import { useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useSelector } from 'react-redux'
import useAsyncValidateState from '../../hooks/useAsyncValidateState'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Alert from '../Alert/Alert'

export default function CheckoutButton({ styles }) {
    const { cart } = useSelector((state) => state.cart)
    const { isLoading, setIsLoading, message, setMessage, error, setError, showAlert, setShowAlert } =
        useAsyncValidateState()
    const stripe = useStripe()
    const handleCheckout = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        setMessage('')
        setError('')
        setShowAlert(false)

        try {
            const res = await axios({
                method: 'POST',
                url: `https://enigmatic-harbor-26816.herokuapp.com/api/v1/orders/checkout-session`,
                data: {
                    items: cart,
                },
            })
            if (res.data.status === 'success') {
                stripe.redirectToCheckout({
                    sessionId: res.data.session.id,
                })
            }
        } catch (err) {
            console.log(err.response)
            setError(
                'Something went wrong when directing you to the checkout. Please wait for 10 minutes then try again later.'
            )
            setShowAlert(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button type="button" className={styles} onClick={handleCheckout}>
                Checkout
            </button>
            {isLoading &&
                ReactDOM.createPortal(
                    <div className="z-30 fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center">
                        <FontAwesomeIcon icon={faSpinner} className="text-cyan-400 w-16 h-16 animate-spin" />
                    </div>,
                    document.getElementById('modal-container')
                )}
            {showAlert &&
                ReactDOM.createPortal(
                    <>
                        <Alert
                            type={message ? 'success' : 'error'}
                            message={message ? message : error ? error : ''}
                            delayToClose={3000}
                            closeCallback={() => setShowAlert(false)}
                        />
                    </>,
                    document.getElementById('modal-container')
                )}
        </>
    )
}
