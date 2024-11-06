import { loadStripe } from "@stripe/stripe-js";

const getStripe = () =>
  loadStripe(
    "pk_test_51QID0RG4gkx8uernFQDgCSTbQLTe0LMlAm9e8WGSmJIsArtHnosETxv9ZSh2Uhgkg5xF6WLtUYmR8bq8AmOAjG9500MJvlaupK"
  );

export default getStripe;
