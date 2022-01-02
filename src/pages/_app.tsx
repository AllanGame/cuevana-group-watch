import '../styles/globals.css'
import type { AppProps } from 'next/app'

// ICONS
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faArrowRight,
    faGripVertical,
    faPlus,
    faPlay,
    faPause,
    faUndo,
    faRedo,
    faVolumeMute,
    faVolumeDown,
    faVolumeUp,
    faCompress,
    faExpand,
    faCog,
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { UserContext } from '../users/user.context'
library.add(
    faArrowRight,
    faGripVertical,
    faPlus,
    faPlay,
    faPause,
    faUndo,
    faRedo,
    faVolumeMute,
    faVolumeDown,
    faVolumeUp,
    faCompress,
    faExpand,
    faCog,
    faChevronLeft,
    faChevronRight
);

function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser} as any}>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}

export default MyApp
