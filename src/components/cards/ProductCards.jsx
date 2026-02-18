import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../ui/SkeletonLoader";
import useImageLoading from "../../hooks/useImageLoading";
import { menProducts } from "../../data/menProducts";
import { womenProducts } from "../../data/womenProducts";

const ProductCards = ({ filters, gender = "men" }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Get all product images for preloading
  const allImages = products
    .flatMap((product) => [product.image, product.hoverImage])
    .filter(Boolean);
  const { handleImageLoad, isImageLoaded: checkImageLoaded } =
    useImageLoading(allImages);

  // Handle image loading
  const onImageLoad = (productId) => {
    handleImageLoad(productId);
  };

  // Mock product data
  useEffect(() => {
    const mockProducts = gender === "women" ? womenProducts : menProducts;
    setProducts(mockProducts);
  }, [gender]);

  // Filter products based on selected filters
  useEffect(() => {
    let filtered = products;

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filters.category,
      );
    }

    // Handle price sorting
    if (filters.price === "high") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (filters.price === "low") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  // Generate dynamic title based on category filter
  const getPageTitle = () => {
    const genderTitle = gender === "women" ? "Women" : "Men";

    if (filters.category === "sweaters") {
      return `${genderTitle} Sweaters`;
    } else if (filters.category === "tshirts") {
      return `${genderTitle} T-shirts`;
    } else if (filters.category === "shirts") {
      return `${genderTitle} Shirts`;
    } else if (filters.category === "jackets") {
      return `${genderTitle} Jackets`;
    }
    return genderTitle;
  };

  return (
    <div>
      {/* Page Title - Centered above grid */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900">
          {getPageTitle()}
        </h1>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isImageLoaded = checkImageLoaded(product.id);

          return (
            <div key={product.id} className="relative">
              {/* Skeleton Loader - Show while image is loading */}
              {!isImageLoaded && <SkeletonLoader variant="card" />}

              {/* Product Card - Show when image is loaded */}
              <div
                className={`bg-white group cursor-pointer transition-opacity duration-300 ease-in-out ${
                  isImageLoaded
                    ? "opacity-100"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => navigate(`/${gender}/${product.id}`)}
              >
                {/* Product Image */}
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-3 relative group">
                  {/* Default Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-opacity duration-200 ease-in-out ${
                      hoveredProduct === product.id
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                    loading="eager"
                    fetchPriority="high"
                    onLoad={() => onImageLoad(product.id)}
                  />
                  {/* Hover Image */}
                  {product.hoverImage && (
                    <img
                      src={product.hoverImage}
                      alt={`${product.name} hover`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-in-out ${
                        hoveredProduct === product.id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      loading="lazy"
                    />
                  )}

                  {/* Add to Cart Button - Hover Effect */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-3 transition-all duration-300 ease-in-out transform ${
                      hoveredProduct === product.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                    }`}
                  >
                    <span className="text-sm font-medium">Add to Cart</span>
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <h3
                    className={`text-xs font-medium text-gray-900 mb-1 transition-all duration-300 ease-in-out ${
                      hoveredProduct === product.id
                        ? "underline decoration-gray-900 decoration-1 underline-offset-2"
                        : "no-underline"
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found matching your filters.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCards;
