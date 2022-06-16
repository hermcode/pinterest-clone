import jwt_decode from 'jwt-decode'

export const decodeUserInfo = () => {

  const token = localStorage.getItem('userToken')
  const user = jwt_decode(token)

  return user
}