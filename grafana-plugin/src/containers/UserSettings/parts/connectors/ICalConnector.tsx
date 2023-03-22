import React, { useEffect, useState } from 'react';

import { Button, Icon, Label, LoadingPlaceholder } from '@grafana/ui';
import cn from 'classnames/bind';
import CopyToClipboard from 'react-copy-to-clipboard';

import Text from 'components/Text/Text';
import { WithPermissionControlTooltip } from 'containers/WithPermissionControl/WithPermissionControlTooltip';
import { User } from 'models/user/user.types';
import { useStore } from 'state/useStore';
import { openNotification } from 'utils';
import { UserActions } from 'utils/authorization';

import styles from './index.module.css';

const cx = cn.bind(styles);

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ICalConnectorProps {
  id: User['pk'];
}

const ICalConnector = (props: ICalConnectorProps) => {
  const { id } = props;

  const store = useStore();
  const { userStore } = store;

  const [showICalLink, setShowICalLink] = useState<string>(undefined);
  const [isICalLinkExisting, setIsICalLinkExisting] = useState<boolean>(false);
  const [iCalLoading, setiCalLoading] = useState<boolean>(true);

  useEffect(() => {
    userStore
      .getiCalLink(id)
      .then((_res) => {
        setIsICalLinkExisting(true);
        setiCalLoading(false);
      })
      .catch((_res) => {
        setIsICalLinkExisting(false);
        setiCalLoading(false);
      });
  }, []);

  const handleCreateiCalLink = async () => {
    setIsICalLinkExisting(true);
    await userStore.createiCalLink(id).then((res) => setShowICalLink(res?.export_url));
  };

  const handleRevokeiCalLink = async () => {
    setIsICalLinkExisting(false);
    setShowICalLink(undefined);
    await userStore.deleteiCalLink(id);
  };

  return (
    <div className={cx('user-item')}>
      <Label>iCal link:</Label>
      <Text type="secondary">Secret iCal export link to add your assigned on call shifts to your calendar.</Text>
      <div className={cx('iCal-settings')}>
        {iCalLoading ? (
          <LoadingPlaceholder text="Loading..." />
        ) : (
          <>
            {isICalLinkExisting ? (
              <>
                {showICalLink !== undefined ? (
                  <>
                    <div className={cx('iCal-link-container')}>
                      <Icon name="exclamation-triangle" className={cx('warning-icon')} />{' '}
                      <Text type="warning">Make sure you copy it - you won't be able to access it again.</Text>
                      <div className={cx('iCal-link')}>{showICalLink}</div>
                    </div>
                    <CopyToClipboard
                      text={showICalLink}
                      onCopy={() => {
                        openNotification('iCal link is copied');
                      }}
                    >
                      <Button icon="copy" variant="secondary" className={cx('iCal-button')}>
                        Copy iCal link
                      </Button>
                    </CopyToClipboard>
                  </>
                ) : (
                  <>
                    <Text type="secondary">
                      In case you lost your iCal link you can revoke it and generate a new one.
                    </Text>
                    <WithPermissionControlTooltip userAction={UserActions.UserSettingsWrite}>
                      <Button
                        icon="trash-alt"
                        onClick={handleRevokeiCalLink}
                        className={cx('iCal-button')}
                        variant="destructive"
                        fill="outline"
                      >
                        Revoke iCal link
                      </Button>
                    </WithPermissionControlTooltip>
                  </>
                )}
              </>
            ) : (
              <WithPermissionControlTooltip userAction={UserActions.UserSettingsWrite}>
                <Button
                  icon="plus"
                  onClick={handleCreateiCalLink}
                  className={cx('iCal-button')}
                  variant="secondary"
                  data-testid="create-ical-link"
                >
                  Create iCal link
                </Button>
              </WithPermissionControlTooltip>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ICalConnector;
