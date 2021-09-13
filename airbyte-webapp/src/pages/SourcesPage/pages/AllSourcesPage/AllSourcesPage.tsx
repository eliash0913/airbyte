import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useResource } from 'rest-hooks';

import { Button, MainPageWithScroll } from '@app/components';
import { Routes } from '@app/pages/routes';
import PageTitle from '@app/components/PageTitle';
import useRouter from '@app/hooks/useRouter';
import SourcesTable from './components/SourcesTable';
import SourceResource from '@app/core/resources/Source';
import HeadTitle from '@app/components/HeadTitle';
import Placeholder, { ResourceTypes } from '@app/components/Placeholder';
import useWorkspace from '@app/hooks/services/useWorkspace';

const AllSourcesPage: React.FC = () => {
  const { push } = useRouter();
  const { workspace } = useWorkspace();
  const { sources } = useResource(SourceResource.listShape(), {
    workspaceId: workspace.workspaceId,
  });

  const onCreateSource = () => push(`${Routes.Source}${Routes.SourceNew}`);
  return (
    <MainPageWithScroll
      headTitle={<HeadTitle titles={[{ id: 'admin.sources' }]} />}
      pageTitle={
        <PageTitle
          title={<FormattedMessage id="sidebar.sources" />}
          endComponent={
            <Button onClick={onCreateSource} data-id="new-source">
              <FormattedMessage id="sources.newSource" />
            </Button>
          }
        />
      }
    >
      {sources.length ? (
        <SourcesTable sources={sources} />
      ) : (
        <Placeholder resource={ResourceTypes.Sources} />
      )}
    </MainPageWithScroll>
  );
};

export default AllSourcesPage;
