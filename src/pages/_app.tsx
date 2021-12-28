import '../styles/globals.css'
import type { AppProps } from 'next/app'

// ICONS
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faGripVertical } from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react'
import User from '../users/user'
import { UserContext } from '../users/user.context'
library.add(faArrowRight, faGripVertical)

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{user, setUser} as any}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
