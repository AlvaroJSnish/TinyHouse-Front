import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Layout, Col, Row } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { LISTING } from '../../lib/graphql/queries';
import {
  Listing as ListingData,
  ListingVariables,
} from '../../lib/graphql/queries/Listing/__generated__/Listing';
import { PageSkeleton, ErrorBanner } from '../../lib/components';
import {
  ListingDetails,
  ListingBookings,
  ListingCreateBooking,
} from './components';
import { Moment } from 'moment';

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 3;

export const Listing = ({ match }: RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

  const { loading, data, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (loading) {
    return (
      <Layout.Content className="listings">
        <PageSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="listings">
        <ErrorBanner description="This listing may not exists or we've encountered an error. Please try again soon!" />
        <PageSkeleton />
      </Layout.Content>
    );
  }

  const listing = data?.listing;
  const listingBookings = listing?.bookings;

  const listingDatailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  const listingBookingsElements = listingBookings ? (
    <ListingBookings
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
      listingBookings={listingBookings}
    />
  ) : null;

  const listingCreateBooking = listing ? (
    <ListingCreateBooking
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null;

  return (
    <Layout.Content className="listings">
      <Row gutter={24} type="flex" justify="space-between">
        <Col xs={24} lg={14}>
          {listingDatailsElement}
          {listingBookingsElements}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBooking}
        </Col>
      </Row>
    </Layout.Content>
  );
};
