sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sync.c20.test.jsonmodel.controller.View1", {
            onInit: function () {
                var oData = {
                    text1: '문자',
                    text2: "문자",
                    text3: "'문자'",
                    text4: '"문자"',
                    int:1,
                    float: 1.1,
                    list: [
                        {key: 'KRW' },
                        {key: 'USD '}
                    ]
                };
                
                var oModel = new JSONModel(oData);

                // this 는 이 환경에서는 Controller를 의미한다.
                // 항상 Controller는 this로 불린다. (x)
                var oView = this.getView();
                oView.setModel(oModel);
            },
            onAdd: function() {
                // <Input id = "idInput1" value = "{/int}" /> 
                var oInput1 = this.byId("idInput1");
                var num1 = parseInt(oInput1.getValue());
                // <Input id = "idInput2" value = "{/float}" />
                var oModel = this.getView().getModel();
                // JSONModel 일 때 가능
                var oData = oModel.getData();
                var num2 = parseFloat(oData.float);
                // 일반적으로 Model은 getProperty() 사용해서 값을 가져온다.
                var num2 = oModel.getProperty("/float");

                //계산된 결과
                var result = 0;
                result = num1 + num2;
                // <Text id = "idText1" text="{/result}" />
                oModel.setProperty("/result",result);
            }
        });
    });
