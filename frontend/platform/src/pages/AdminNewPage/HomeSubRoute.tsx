export default function HomeSubRoute() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">欢迎使用管理后台</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">用户管理</h3>
            <p className="text-blue-600 text-sm">管理系统用户和权限</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">聊天功能</h3>
            <p className="text-green-600 text-sm">智能聊天和对话管理</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800 mb-2">系统设置</h3>
            <p className="text-purple-600 text-sm">配置系统参数和选项</p>
          </div>
        </div>
      </div>
    </div>
  );
}
