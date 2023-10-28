export const productSchema = {
    type: "object",
    properties: {
      price: {type: "number"},
      title: {type: "string", minLength: 1},
      count: {type: "integer"},
      description: {type: "string"},
      img: {type: "string"}
    },
    required: ['price', 'title', 'count', 'description', 'img']
}
