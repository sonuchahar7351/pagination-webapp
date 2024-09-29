import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories, setSelectedCategory } from "./redux/categoriesSlice";
import { fetchProducts, resetProducts } from "./redux/productsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import "./app.css";
const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const location = useLocation();

  const { categories, selectedCategory } = useSelector(
    (state) => state.categories
  );
  const { products, status, page, hasMore } = useSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // // Update query params when category or search changes
  // useEffect(() => {
  //   const params = new URLSearchParams();
  //   if (selectedCategory) params.set("category", selectedCategory);
  //   if (search) params.set("search", search);
  //   navigate({ search: params.toString() });
  // }, [selectedCategory, search, navigate]);

  // Fetch products when category or search changes
  useEffect(() => {
    dispatch(resetProducts());
    dispatch(fetchProducts({ category: selectedCategory, skip: 0, search }));
  }, [selectedCategory, search, dispatch]);

  // Load more products for pagination
  const loadMoreProducts = () => {
    if (hasMore && status !== "loading") {
      dispatch(
        fetchProducts({
          category: selectedCategory,
          skip: (page + 1) * 8,
          search,
        })
      );
    }
  };

  return (
    <div className="container">
      <h1>Product Store</h1>

      {/* Category Selector */}
      <div className="featurs">
        <div className=" select">
          <select
            value={selectedCategory}
            onChange={(e) =>{ dispatch(setSelectedCategory(e.target.value)); setSearch("")}}
          >
            <option value="">All Categories</option>
            {categories?.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="search">
          <input
            type="text"
            value={search}
            onChange={(e) => {setSearch(e.target.value); dispatch(setSelectedCategory(""))}}
            placeholder="Search products..."
            className=""
          />
        <button>Search</button>
        </div>
        
      </div>
      {/* Product List */}

      <div className="products grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="product">
            <h3 className="">{product.title}</h3>
            <p className="">{product.description}</p>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className=" loadmore">
          <button
            onClick={loadMoreProducts}
            className={`${status === "loading" ? "loading" : ""}`}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
