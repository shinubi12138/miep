import Authorized from './Authorized'
import AuthorizedRoute from './AuthorizedRoute'
import Secured from './Secured'
import check from './CheckPermissions'

let CURRENT = 'NULL'

Authorized.Secured = Secured
Authorized.AuthorizedRoute = AuthorizedRoute
Authorized.check = check

const renderAuthorize = currentAuthority => {
  if (currentAuthority) {
    if (currentAuthority.constructor.name === 'Function') {
      CURRENT = currentAuthority()
    }
    if (currentAuthority.constructor.name === 'String') {
      CURRENT = currentAuthority
    }
  } else {
    CURRENT = 'NULL'
  }
  return Authorized
}

export { CURRENT }

export default renderAuthorize
