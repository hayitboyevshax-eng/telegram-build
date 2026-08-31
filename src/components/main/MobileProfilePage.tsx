import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiUser, ApiUserFullInfo, ApiUserStatus } from '../../api/types';

import { SettingsScreens } from '../../types';

import { getMainUsername, getUserFullName, getUserStatus } from '../../global/helpers';
import { selectUser, selectUserFullInfo, selectUserStatus } from '../../global/selectors';
import { formatPhoneNumber } from '../../util/phoneNumber';

import useLang from '../../hooks/useLang';
import useOldLang from '../../hooks/useOldLang';

import styles from './MobileProfilePage.module.scss';

type OwnProps = {
  onClose: () => void;
};

type StateProps = {
  user?: ApiUser;
  userFullInfo?: ApiUserFullInfo;
  userStatus?: ApiUserStatus;
};

const MobileProfilePage = ({
  user, userFullInfo, userStatus, onClose,
}: OwnProps & StateProps) => {
  const { openSettingsScreen } = getActions();
  const lang = useLang();
  const oldLang = useOldLang();

  const fullName = user ? getUserFullName(user) : '';
  const initial = fullName?.trim()?.[0]?.toUpperCase() || '?';
  const mainUsername = user ? getMainUsername(user) : undefined;
  const phone = user?.phoneNumber ? `+${formatPhoneNumber(user.phoneNumber)}` : undefined;
  const bio = userFullInfo?.bio;
  const birthday = userFullInfo?.birthday;
  const statusText = user ? getUserStatus(oldLang, user, userStatus) : undefined;

  const birthdayValue = birthday && (() => {
    const monthLabel = new Intl.DateTimeFormat(navigator.language, { month: 'long' })
      .format(new Date(2000, birthday.month - 1, 1));
    const datePart = `${birthday.day} ${monthLabel}`;
    if (!birthday.year) return datePart;
    const age = new Date().getFullYear() - birthday.year;
    return lang('ProfileBirthdayValueAge', { date: datePart, age }, { pluralValue: age });
  })();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label={lang('Close')}>
          ✕
        </button>
      </div>

      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>{initial}</div>
        <div className={styles.cameraBadge}>📷</div>
      </div>

      <h2 className={styles.name}>{fullName || '...'}</h2>
      <p className={styles.status}>{statusText}</p>

      <div className={styles.quickActions}>
        <button type="button" className={styles.quickAction}>
          <span className={styles.quickActionIcon}>📷</span>
          <span>{lang('ChangeYourProfilePicture')}</span>
        </button>
        <button
          type="button"
          className={styles.quickAction}
          onClick={() => openSettingsScreen({ screen: SettingsScreens.EditProfile })}
        >
          <span className={styles.quickActionIcon}>✏️</span>
          <span>{lang('SettingsAccount')}</span>
        </button>
        <button
          type="button"
          className={styles.quickAction}
          onClick={() => openSettingsScreen({ screen: SettingsScreens.Main })}
        >
          <span className={styles.quickActionIcon}>⚙️</span>
          <span>{lang('Settings')}</span>
        </button>
      </div>

      <div className={styles.infoCard}>
        {phone && (
          <div className={styles.infoRow}>
            <span className={styles.infoValue}>{phone}</span>
            <span className={styles.infoLabel}>{oldLang('Phone')}</span>
          </div>
        )}
        {bio && (
          <div className={styles.infoRow}>
            <span className={styles.infoValue}>{bio}</span>
            <span className={styles.infoLabel}>{oldLang('UserBio')}</span>
          </div>
        )}
        {mainUsername && (
          <div className={styles.infoRow}>
            <span className={styles.infoValue}>{`@${mainUsername}`}</span>
            <span className={styles.infoLabel}>{oldLang('Username')}</span>
          </div>
        )}
        {birthday && (
          <div className={styles.infoRow}>
            <span className={styles.infoValue}>{birthdayValue}</span>
            <span className={styles.infoLabel}>{lang('ProfileBirthday')}</span>
          </div>
        )}
        {!phone && !bio && !mainUsername && !birthday && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>…</span>
          </div>
        )}
      </div>

      {/* Quyidagi "Postlar" bo'limi Telegram'ning o'zida umuman mavjud emas,
          shuning uchun rasmiy tarjima kaliti yo'q — matn qo'lda (o'zbekcha)
          qoldirilgan va boshqa tillarga avtomatik o'girilmaydi. */}
      <div className={styles.postsTabs}>
        <span className={`${styles.postsTab} ${styles.postsTabActive}`}>Postlar</span>
        <span className={styles.postsTab}>Arxivlangan postlar</span>
      </div>

      <div className={styles.emptyPosts}>
        <p>Hozircha postlar yo'q…</p>
        <button type="button" className={styles.addPostButton}>
          📷 Post qo'shish
        </button>
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global): StateProps => {
    const { currentUserId } = global;
    const user = currentUserId ? selectUser(global, currentUserId) : undefined;
    return {
      user,
      userFullInfo: currentUserId ? selectUserFullInfo(global, currentUserId) : undefined,
      userStatus: currentUserId ? selectUserStatus(global, currentUserId) : undefined,
    };
  },
)(MobileProfilePage));
