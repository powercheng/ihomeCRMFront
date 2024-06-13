前端登陆成功后，存储token到localstorage，每次请求带上token，会被验证有效性。
新增用户，name, contact, Customer Acquisition Channels，Sale Rep






v-bind 等同于 :prop
可以将属性传递给子组件
比如
            <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="saveData"
                :updateWithStatus="submitData" />
都将数据传递给子组件了。
