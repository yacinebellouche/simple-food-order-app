import useFetch from "../hooks/useFetch";
import MealItem from "./MealItem";
import Error from "./ErrorMessage";

const requestConfig = {};
export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useFetch("http://localhost:3000/meals", requestConfig, []);
  if (isLoading) {
    <p className="center">Fetching meals...</p>;
  }
  if (error) {
    <Error title="Failed to fetch meals" message={error} />;
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal}></MealItem>
      ))}
    </ul>
  );
}
