sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ux400.exercise17.controller.View1", {
            onInit: function () {

            },

            onOpenDialog: function () {

                //view에 idCarrierDialog를 찾아서 oDialog에 연결
                var oDialog = this.byId("idCarrierDialog");

                if(oDialog){ //view의 메모리 확인 시 id가 idCarrierDialog인 게 존재하는 경우
                    //있다면 화면에 보이도록 open() 호출
                    oDialog.open(); 
                }else { //view에서 찾을 수 없는 경우
                    //fragment.xml 파일을 찾아 읽어온다.

                    var oView = this.getView();
                    sap.ui.core.Fragment.load({
                        id : oView.getId(),
                        name : "ux400.exercise17.view.CarriersDialog",
                        controller : this
                    }).then(function(oDialog) {
                        //View1.view.xml에 팝업을 연결하고, 화면에 보이도록 open() 호출
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                }

            },

            onCloseDialog: function ( ) {
                var oDialog = this.byId("idCarrierDialog");
                if (oDialog) {
                    oDialog.close();
                }
            }
        });
    });