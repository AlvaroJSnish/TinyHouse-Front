import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Col, Layout, Row } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { USER } from '../../lib/graphql/queries';
import {
  User as UserData,
  UserVariables,
} from '../../lib/graphql/queries/User/__generated__/User';
import { UserProfile } from './components';
import { Viewer } from '../../lib/types';
import { PageSkeleton, ErrorBanner } from '../../lib/components';

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

const { Content } = Layout;

export const User = ({
  match,
  viewer,
}: RouteComponentProps<MatchParams> & Props) => {
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
    },
  });

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exists or we've encountered an error. Please try again later." />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data?.user;
  const viewerIsUser = viewer.id === match.params.id;
  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;

  return (
    <Content className="user">
      <Row gutter={12} type="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
