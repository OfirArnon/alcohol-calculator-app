import React, { useState, useEffect } from "react";

export default function App() {
  const [ingredients, setIngredients] = useState([
    { name: "", volume: 42.5, abv: 0 },
  ]);
  const [unit, setUnit] = useState("ml");
  const [customIngredients, setCustomIngredients] = useState(() => {
    const stored = localStorage.getItem("customIngredients");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("customIngredients", JSON.stringify(customIngredients));
  }, [customIngredients]);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = field === "name" ? value : parseFloat(value) || 0;
    if (field === "name" && customIngredients[value]) {
      updated[index].abv = customIngredients[value];
    }
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", volume: 42.5, abv: 0 }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const totalVolume = ingredients.reduce((sum, ing) => sum + ing.volume, 0);
  const totalAlcohol = ingredients.reduce((sum, ing) => sum + (ing.volume * ing.abv) / 100, 0);
  const totalABV = totalVolume ? ((totalAlcohol / totalVolume) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 space-y-6 font-sans">

<h1 className="text-3xl font-bold flex items-center gap-2 text-pink-300">
  🍸 Cocktail Alcohol Calculator
</h1>

      <div className="flex gap-4 items-center mb-6">
        <label>Units:</label>
        <button
          onClick={() => setUnit(unit === "ml" ? "oz" : "ml")}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          {unit === "ml" ? "ml" : "oz"}
        </button>
      </div>

      {ingredients.map((ing, idx) => (
        <div key={idx} className="mb-4 p-4 border border-gray-700 rounded bg-gray-800">
          <div className="mb-2">
            <label>Name:</label>
            <input
className="w-full p-2 mt-1 bg-gray-800 rounded border border-gray-600 text-white placeholder-gray-400"
              value={ing.name}
              onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
              placeholder="Ingredient name"
            />
          </div>
          <div className="mb-2">
            <label>Volume ({unit}):</label>
            <input
              type="number"
className="w-full p-2 mt-1 bg-gray-800 rounded border border-gray-600 text-white placeholder-gray-400"
              value={ing.volume}
              onChange={(e) => handleIngredientChange(idx, "volume", e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label>ABV (%):</label>
            <input
              type="number"
className="w-full p-2 mt-1 bg-gray-800 rounded border border-gray-600 text-white placeholder-gray-400"
              value={ing.abv}
              onChange={(e) => handleIngredientChange(idx, "abv", e.target.value)}
            />
          </div>
          <button
            onClick={() => removeIngredient(idx)}
            className="text-red-400 mt-2 underline"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addIngredient}
        className="bg-green-600 px-4 py-2 rounded text-white mb-6"
      >
        + Add Ingredient
      </button>

      <div className="p-4 bg-purple-800 rounded">
        <p>Total Volume: {totalVolume.toFixed(2)} {unit}</p>
        <p>Total Alcohol: {totalAlcohol.toFixed(2)} {unit}</p>
        <p>Total ABV: {totalABV} %</p>
      </div>
    </div>
  );
}
