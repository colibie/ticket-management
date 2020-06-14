import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import SellTickets from "./views/SellTickets";
import Movies from "./views/Movies";
import Users from "./views/Users";
import CreateAdmin from "./views/CreateAdmin";
import UserProfileLite from "./views/UserProfileLite";
// import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import BlogPosts from "./views/BlogPosts";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/sell-tickets" />
  },
  {
    path: "/sell-tickets",
    layout: DefaultLayout,
    component: SellTickets
  },
  {
    path: "/movies",
    layout: DefaultLayout,
    component: Movies
  },
  {
    path: "/users",
    layout: DefaultLayout,
    component: Users
  },
  {
    path: "/create-admin",
    layout: DefaultLayout,
    component: CreateAdmin,
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  // {
  //   path: "/add-new-post",
  //   layout: DefaultLayout,
  //   component: AddNewPost
  // },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
];
