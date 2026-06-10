"use client";

import { useState } from "react";

const EQUATOR_THRESHOLD = 5;

type City = {
  name: string;
  country: string;
  latitude: number;
};

const CITIES: City[] = [
  { name: "弘前市", country: "日本", latitude: 40.6 },
  { name: "青森市", country: "日本", latitude: 40.8 },
  { name: "ニューヨーク", country: "アメリカ", latitude: 40.7 },
  { name: "ローマ", country: "イタリア", latitude: 41.9 },
  { name: "東京", country: "日本", latitude: 35.7 },
  { name: "大阪", country: "日本", latitude: 34.7 },
  { name: "カイロ", country: "エジプト", latitude: 30.0 },
  { name: "ホノルル", country: "アメリカ", latitude: 21.3 },
  { name: "シンガポール", country: "シンガポール", latitude: 1.3 },
  { name: "キト", country: "エクアドル", latitude: -0.2 },
  { name: "シドニー", country: "オーストラリア", latitude: -33.9 },
  { name: "ブエノスアイレス", country: "アルゼンチン", latitude: -34.6 },
  { name: "ケープタウン", country: "南アフリカ", latitude: -33.9 },
  { name: "ウシュアイア", country: "アルゼンチン", latitude: -54.8 },
];

function findNearbyCities(inputLatitude: number, count: number) {
  return CITIES
    .map((city) => ({
      ...city,
      diff: Math.abs(inputLatitude - city.latitude),
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, count);
}

const PRESET_LATITUDES = [
  { label: "0°（赤道）", value: "0" },
  { label: "40.6°（弘前付近）", value: "40.6" },
  { label: "90°（北極）", value: "90" },
  { label: "-90°（南極）", value: "-90" },
];

function getDescription(latitude: number): string {
  if (Math.abs(latitude) < EQUATOR_THRESHOLD) {
    return "赤道付近では見かけの回転はほぼ起こりません。";
  }
  if (latitude > 0) {
    return "北半球では、振り子の振動面は時計回りに回転して見えます。";
  }
  return "南半球では、振り子の振動面は反時計回りに回転して見えます。";
}

function calculatePeriodHours(latitude: number): number {
  return 24 / Math.abs(Math.sin((latitude * Math.PI) / 180));
}

export default function Home() {
  const [latitude, setLatitude] = useState<string>("40.6");

  const latitudeNumber = parseFloat(latitude);
  const isValidLatitude =
    !isNaN(latitudeNumber) &&
    latitudeNumber >= -90 &&
    latitudeNumber <= 90;

  const isEquator =
    isValidLatitude && Math.abs(latitudeNumber) < EQUATOR_THRESHOLD;

  const periodHours =
    isValidLatitude && !isEquator
      ? calculatePeriodHours(latitudeNumber)
      : null;

  const nearbyCities = isValidLatitude ? findNearbyCities(latitudeNumber, 3) : [];

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          フーコーの振り子
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          緯度を入力すると、見かけの回転周期が計算されます。
        </p>

        <label className="block text-gray-700 font-medium mb-1" htmlFor="latitude">
          緯度（-90〜90度）
        </label>
        <input
          id="latitude"
          type="number"
          min={-90}
          max={90}
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          placeholder="例：40.6"
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_LATITUDES.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setLatitude(preset.value)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-lg border border-gray-300"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {!isValidLatitude && (
          <p className="text-red-500 text-sm mb-4">
            -90〜90の範囲で入力してください。
          </p>
        )}

        {isValidLatitude && (
          <div className="mt-2 p-4 bg-blue-50 rounded-xl">
            {isEquator ? (
              <p className="text-blue-800 font-semibold">
                赤道付近では見かけの回転はほぼ起こりません。
              </p>
            ) : (
              <p className="text-blue-800 font-semibold text-lg">
                約{periodHours!.toFixed(1)}時間で一周して見えます。
              </p>
            )}
            <p className="text-gray-600 text-sm mt-2">
              {getDescription(latitudeNumber)}
            </p>
          </div>
        )}

        {isValidLatitude && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-gray-700 text-sm font-medium mb-2">緯度が近い代表都市</p>
            <ul className="space-y-1">
              {nearbyCities.map((city) => (
                <li key={`${city.name}-${city.country}`} className="flex justify-between text-sm text-gray-700">
                  <span>{city.name}（{city.country}）</span>
                  <span className="text-gray-500">緯度 {city.latitude}° ／ 差 {city.diff.toFixed(1)}°</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-700 text-sm font-medium mb-1">計算式について</p>
          <p className="text-gray-600 text-sm">
            このアプリでは学習用の近似として、次の式を使っています。
          </p>
          <p className="text-gray-800 text-sm font-mono mt-2">
            周期 = 24 ÷ |sin(緯度)|
          </p>
          <p className="text-gray-500 text-xs mt-2">
            緯度0度付近では sin(緯度) がほぼ0になるため、周期が非常に大きくなります。
            そのため赤道付近では「見かけの回転はほぼ起こらない」と表示しています。
          </p>
        </div>
      </div>
    </main>
  );
}
