import AddGraphic from "views/Graphics/AddGraphic/";

var internalroutes = [
  {
    path: "/graphic/add",
    name: "Add Graphic",
    component: AddGraphic,
    layout: "/admin"
  },
  {
    path: "/graphic/edit/:id",
    name: "Edit Graphic",
    component: AddGraphic,
    layout: "/admin"
  }
];

export default internalroutes;
