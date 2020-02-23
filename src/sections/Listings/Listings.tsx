import React, { FunctionComponent } from 'react';

import { useQuery, useMutation } from '../../lib/api';
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from './types';

const LISTINGS = `
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

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings: FunctionComponent<Props> = ({ title }) => {
  const { data, loading, refetch, error } = useQuery<ListingsData>(LISTINGS);
  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ id });
    refetch();
  };

  const renderListings = data?.listings?.map(listing => {
    return (
      <li key={listing.id}>
        {listing.title}
        <button onClick={() => handleDeleteListing(listing.id)}>
          Delete a listing
        </button>
      </li>
    );
  });

  if (deleteListingLoading) {
    return <h2>Deletion in progress...</h2>;
  }

  if (deleteListingError) {
    return <h2>Error deleting a listing :(</h2>;
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Uh oh! Something went wrong - please try again later :(</h2>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <ul>{renderListings}</ul>
    </div>
  );
};
