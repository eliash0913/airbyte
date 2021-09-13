import React, { useEffect } from 'react';
import * as FullStory from '@fullstory/browser';

import { useConfig } from '@app/config';
import useFullStory from '@app/hooks/useFullStory';
import AnalyticsServiceProvider, {
  useAnalytics,
} from '@app/hooks/useAnalytics';
import useTracker from '@app/hooks/useOpenReplay';
import useSegment from '@app/hooks/useSegment';
import { useGetService } from '@app/core/servicesProvider';

function WithAnalytics({
  customerId,
}: {
  customerId: string;
  workspaceId?: string;
}) {
  const config = useConfig();

  // segment section
  useSegment(config.segment.enabled ? config.segment.token : '');
  const analyticsService = useAnalytics();
  useEffect(() => {
    analyticsService.identify(customerId);
  }, [analyticsService, customerId]);

  // openreplay section
  const tracker = useTracker(config.openreplay);
  useEffect(() => {
    tracker.userID(customerId);
  }, [tracker, customerId]);

  // fullstory section
  const initializedFullstory = useFullStory(config.fullstory);
  useEffect(() => {
    if (initializedFullstory) {
      FullStory.identify(customerId);
    }
  }, [initializedFullstory, customerId]);

  return null;
}

const AnalyticsInitializer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const customerIdProvider = useGetService<() => string>(
    'useCustomerIdProvider'
  );
  const customerId = customerIdProvider();
  const config = useConfig();

  return (
    <AnalyticsServiceProvider userId={customerId} version={config.version}>
      <WithAnalytics customerId={customerId} />
      {children}
    </AnalyticsServiceProvider>
  );
};

export { AnalyticsInitializer };
