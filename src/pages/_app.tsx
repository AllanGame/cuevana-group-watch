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
    faCog
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { UserContext } from '../users/user.context'
import {GroupContext} from "../groups/group.context";
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
    faCog
);

function MyApp({ Component, pageProps }: AppProps) {
    const [user, setUser] = useState(null);
    const [group, setGroup] = useState(null);

  return (
    <GroupContext.Provider value={{group, setGroup} as any}>
        <UserContext.Provider value={{user, setUser} as any}>
            <Component {...pageProps} />
        </UserContext.Provider>
    </GroupContext.Provider>
  )
}

export default MyApp
