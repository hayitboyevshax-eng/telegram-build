import { memo, useState } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { LangKey } from '../../types/language';
import { LeftColumnContent } from '../../types';

import { selectCurrentMessageList } from '../../global/selectors';
import buildClassName from '../../util/buildClassName';

import useLang from '../../hooks/useLang';

import MobileProfilePage from './MobileProfilePage';

import styles from './MobileNavBar.module.scss';

type TabId = 'chats' | 'contacts' | 'settings' | 'profile';

type StateProps = {
  hasOpenChat: boolean;
};

const TABS: { id: TabId; langKey: LangKey; icon: string }[] = [
  { id: 'chats', langKey: 'Chats', icon: '💬' },
  { id: 'contacts', langKey: 'Contacts', icon: '👤' },
  { id: 'settings', langKey: 'Settings', icon: '⚙️' },
  { id: 'profile', langKey: 'Profile', icon: '🙂' },
];

const MobileNavBar = ({ hasOpenChat }: StateProps) => {
  const { openLeftColumnContent } = getActions();
  const lang = useLang();
  const [activeTab, setActiveTab] = useState<TabId>('chats');

  // Bitta ochiq suhbat ichida bo'lsak, panel yozish maydonini to'smasin
  // deb navbar'ni vaqtincha yashiramiz (native ilovalarda ham shunday).
  if (hasOpenChat) {
    return undefined;
  }

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    if (id === 'chats') {
      openLeftColumnContent({ contentKey: LeftColumnContent.ChatList });
    } else if (id === 'settings') {
      openLeftColumnContent({ contentKey: LeftColumnContent.Settings });
    } else if (id === 'contacts') {
      // Telegram'ning o'zidagi tayyor, haqiqiy Kontaktlar ekrani
      openLeftColumnContent({ contentKey: LeftColumnContent.Contacts });
    }
    // 'profile' — pastda alohida overlay sifatida ko'rsatiladi
  };

  return (
    <>
      {activeTab === 'profile' && (
        <MobileProfilePage onClose={() => handleTabClick('chats')} />
      )}

      <nav className={styles.navBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={buildClassName(styles.tabButton, activeTab === tab.id && styles.active)}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{lang(tab.langKey)}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default memo(withGlobal(
  (global): StateProps => {
    return {
      hasOpenChat: Boolean(selectCurrentMessageList(global)?.chatId),
    };
  },
)(MobileNavBar));
