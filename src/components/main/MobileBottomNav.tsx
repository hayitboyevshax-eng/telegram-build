import type { FC } from '../../lib/teact/teact';
import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import { LeftColumnContent, SettingsScreens } from '../../types';
import buildClassName from '../../util/buildClassName';

import Icon from '../common/icons/Icon';

type OwnProps = {
  isMobile?: boolean;
};

type StateProps = {
  activeTab: 'chats' | 'contacts' | 'settings' | 'profile';
};

const MobileBottomNav: FC<OwnProps & StateProps> = ({ isMobile, activeTab }) => {
  const {
    openLeftColumnContent,
    openSettingsScreen,
  } = getActions();

  if (!isMobile) {
    return null;
  }

  const items = [
    {
      key: 'chats',
      label: 'Chatlar',
      icon: 'chat-filled' as const,
      onClick: () => openLeftColumnContent({ contentKey: LeftColumnContent.ChatList }),
    },
    {
      key: 'contacts',
      label: 'Kontaktlar',
      icon: 'user-filled' as const,
      onClick: () => openLeftColumnContent({ contentKey: LeftColumnContent.Contacts }),
    },
    {
      key: 'settings',
      label: 'Sozlamalar',
      icon: 'settings-filled' as const,
      onClick: () => {
        openLeftColumnContent({ contentKey: LeftColumnContent.Settings });
        openSettingsScreen({ screen: SettingsScreens.Main });
      },
    },
    {
      key: 'profile',
      label: 'Profil',
      icon: 'account-filled' as const,
      onClick: () => {
        openLeftColumnContent({ contentKey: LeftColumnContent.Settings });
        openSettingsScreen({ screen: SettingsScreens.EditProfile });
      },
    },
  ] as const;

  return (
    <div className="mobile-bottom-nav">
      {items.map(({ key, label, icon, onClick }) => (
        <button
          key={key}
          type="button"
          className={buildClassName('mobile-bottom-nav__item', activeTab === key && 'is-active')}
          onClick={onClick}
          aria-label={label}
        >
          <Icon name={icon} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default memo(withGlobal<OwnProps>((global, { isMobile }): Complete<StateProps> => {
  const contentKey = global.tabs?.[0]?.contentKey ?? global.tabState?.contentKey ?? undefined;

  let activeTab: StateProps['activeTab'] = 'chats';

  if (contentKey === LeftColumnContent.Contacts) {
    activeTab = 'contacts';
  } else if (contentKey === LeftColumnContent.Settings) {
    activeTab = 'settings';
  }

  return {
    isMobile,
    activeTab,
  };
})(MobileBottomNav));
