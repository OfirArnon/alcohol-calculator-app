import React, { useState, useEffect } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";

const PRESET_VALUES = {
  oz: ["0.5", "1", "1.5", "2"],
  ml: ["15", "30", "45", "60"],
};

const convert = (value, from, to) => {
  const v = parseFloat(value);
  if (isNaN(v)) return "";
  return to === "oz"
    ? Math.round((v / 30) * 100) / 100
    : Math.round(v * 30);
};

const LOCAL_KEY = "commonIngredients";

export default function App() {
  const [page, setPage] = useState("calculator");
  const [unit, setUnit] = useState("oz");
  const [ingredients, setIngredients] = useState([
    { name: "", preset: "1.5", volume: "1.5", abv: "0" },
  ]);
  const [commonIngredients, setCommonIngredients] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setCommonIngredients(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(commonIngredients));
  }, [commonIngredients]);

  const toggleUnit = () => {
    const nextUnit = unit === "oz" ? "ml" : "oz";
    const updated = ingredients.map((ing) => ({
      ...ing,
      preset: convert(ing.preset, unit, nextUnit).toString(),
      volume: convert(ing.volume, unit, nextUnit).toString(),
    }));
    setUnit(nextUnit);
    setIngredients(updated);
  };

  const updateField = (i, field, value) => {
    const updated = [...ingredients];
    updated[i][field] = value;
    if (field === "preset") {
      updated[i]["volume"] = value;
    }
    if (field === "name") {
      const match = commonIngredients.find(
        (item) => item.name.toLowerCase() === value.toLowerCase()
      );
      if (match) updated[i]["abv"] = match.abv;
    }
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: "",
        preset: unit === "oz" ? "1.5" : "45",
        volume: unit === "oz" ? "1.5" : "45",
        abv: "0",
      },
    ]);
  };

  const removeIngredient = (i) => {
    setIngredients(ingredients.filter((_, idx) => idx !== i));
  };

  const totalVolume = ingredients.reduce(
    (sum, ing) => sum + parseFloat(ing.volume || 0),
    0
  );
  const totalAlcohol = ingredients.reduce((sum, ing) => {
    const v = parseFloat(ing.volume || 0);
    const a = parseFloat(ing.abv || 0);
    return sum + (v * a) / 100;
  }, 0);
  const totalABV = totalVolume
    ? ((totalAlcohol / totalVolume) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 space-y-6 font-sans">
      {/* NAVIGATION */}
      <div className="flex gap-4">
        <Button
          variant={page === "calculator" ? "default" : "outline"}
          onClick={() => setPage("calculator")}
        >
          Calculator
        </Button>
        <Button
          variant={page === "manager" ? "default" : "outline"}
          onClick={() => setPage("manager")}
        >
          Manage Ingredients
        </Button>
      </div>

      {page === "calculator" && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              🍸 Cocktail Alcohol Calculator
            </h1>
            <div className="flex items-center gap-2">
              <Label>Use Ounces</Label>
              <Switch checked={unit === "oz"} onCheckedChange={toggleUnit} />
            </div>
          </div>

          {/* HEADERS */}
          <div className="text-sm font-semibold text-white uppercase grid grid-cols-12 gap-2 px-2">
            <div className="col-span-3">Ingredient</div>
            <div className="col-span-2">Preset ({unit})</div>
            <div className="col-span-2">Volume ({unit})</div>
            <div className="col-span-2">ABV (%)</div>
            <div className="col-span-1 text-center">Del</div>
          </div>

          {/* INGREDIENTS */}
          {ingredients.map((ing, index) => (
            <Card key={index} className="bg-zinc-800 px-2 py-3 grid grid-cols-12 gap-2 items-center">
              <Input
                className="col-span-3"
                value={ing.name}
                onChange={(e) => updateField(index, "name", e.target.value)}
                placeholder="Name"
              />
              <select
                className="col-span-2 bg-zinc-700 text-white rounded p-2"
                value={ing.preset}
                onChange={(e) => updateField(index, "preset", e.target.value)}
              >
                {PRESET_VALUES[unit].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <Input
                className="col-span-2"
                value={ing.volume}
                onChange={(e) => updateField(index, "volume", e.target.value)}
              />
              <Input
                className="col-span-2"
                value={ing.abv}
                onChange={(e) => updateField(index, "abv", e.target.value)}
              />
              <Button
                onClick={() => removeIngredient(index)}
                variant="destructive"
                className="col-span-1"
              >
                🗑️
              </Button>
            </Card>
          ))}

          <Button onClick={addIngredient}>+ Add Ingredient</Button>

          <Card className="p-6 bg-gradient-to-r from-purple-700 to-pink-700 text-white mt-6 text-lg space-y-2 font-semibold">
            <p>🥤 Total Volume: {totalVolume.toFixed(2)} {unit}</p>
            <p>💧 Total Alcohol: {totalAlcohol.toFixed(2)} {unit}</p>
            <p>🍸 Total ABV: {totalABV}%</p>
          </Card>
        </>
      )}

      {page === "manager" && (
        <>
          <h1 className="text-2xl font-bold">🧾 Manage Common Ingredients</h1>
          {commonIngredients.map((ing, i) => (
            <Card key={i} className="p-4 mb-2 flex items-center gap-4 bg-zinc-800">
              <Input
                className="w-1/2"
                value={ing.name}
                onChange={(e) => {
                  const updated = [...commonIngredients];
                  updated[i].name = e.target.value;
                  setCommonIngredients(updated);
                }}
              />
              <Input
                className="w-1/3"
                value={ing.abv}
                onChange={(e) => {
                  const updated = [...commonIngredients];
                  updated[i].abv = e.target.value;
                  setCommonIngredients(updated);
                }}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const updated = [...commonIngredients];
                  updated.splice(i, 1);
                  setCommonIngredients(updated);
                }}
              >
                🗑️
              </Button>
            </Card>
          ))}
          <Button
            onClick={() =>
              setCommonIngredients([...commonIngredients, { name: "", abv: "" }])
            }
          >
            + Add Common Ingredient
          </Button>
        </>
      )}
    </div>
  );
}
