"use client";

import { useState } from "react";

const EQUATOR_THRESHOLD = 5;

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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          placeholder="例：40.6"
        />

        {!isValidLatitude && (
          <p className="text-red-500 text-sm">
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
      </div>
    </main>
  );
}
