import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from 'react-apollo';

import { Alert, Avatar, Button, List, Spin } from 'antd';

import {
  Listings as ListingsData,
  Listings_listings,
} from './__generated__/Listings';
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from './__generated__/DeleteListing';

import './styles/Listings.css';
import { ListingsSkeleton } from './components';

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, loading, refetch, error } = useQuery<ListingsData>(LISTINGS);
  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const renderListings = (listing: Listings_listings) => {
    return (
      <List.Item
        key={listing.id}
        actions={[
          <Button
            type="primary"
            onClick={() => handleDeleteListing(listing.id)}
          >
            Delete
          </Button>,
        ]}
      >
        <List.Item.Meta
          title={listing.title}
          description={listing.address}
          avatar={<Avatar src={listing.image} shape="square" size={48} />}
        />
      </List.Item>
    );
  };

  if (deleteListingError) {
    return <h2>Error deleting a listing :(</h2>;
  }

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );
  }

  const deleteListingErrorAlert = deleteListingError && (
    <Alert
      type="error"
      message="Uh oh! Something went wrong - please try again later :("
      className="listings__alert"
    />
  );

  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading} />
      <h2>{title}</h2>
      {deleteListingErrorAlert}
      <List
        itemLayout="horizontal"
        dataSource={data?.listings}
        renderItem={renderListings}
      >
        {renderListings}
      </List>
    </div>
  );
};
