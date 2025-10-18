import React from "react";

export default function TestSubRoute() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-green-600 mb-4">测试页面</h2>
      <p className="text-gray-600">这是一个测试页面，用于验证子路由是否正常工作。</p>
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-700">
          如果你能看到这个页面，说明子路由系统工作正常！
        </p>
      </div>
    </div>
  );
}
