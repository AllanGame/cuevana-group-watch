import '../styles/globals.css'
import type { AppProps } from 'next/app'

// ICONS
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faGripVertical } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowRight, faGripVertical)

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
