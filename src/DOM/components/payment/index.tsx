import './index.scss'
import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { History, createLocation } from 'history'
import TypeList from "Src/DOM/components/payment/TypeList";
import Type0 from "Src/DOM/components/payment/Type0";
import Type1 from "Src/DOM/components/payment/Type1";
import Type3 from "Src/DOM/components/payment/Type3";
import Type4 from "Src/DOM/components/payment/Type4";
import Type5 from "Src/DOM/components/payment/Type5";
import WinOpen from "Src/DOM/components/payment/WinOpen"
import App from 'DOM/index'
type PaymentProps = {
  App: App
  history: History
}

export default class Payment extends React.Component<PaymentProps, {}, any> {

  constructor(props) {
    super(props)
  }

  state = {
    isActive: 0,
    paymentDatas: {},
    url: '',
    winOpen: false
  }

  orderCompleted(orderRes, payments) {
    if (orderRes.code === 200) {
      this.state.paymentDatas[0] = orderRes.data.returnInfo
      var nn = String.prototype.toLocaleLowerCase.call(payments.name.replace(/\s/g, ''))
      if (nn === 'paypal' || nn === 'mycard') {
        this.state.url = orderRes.data.returnInfo.url
        this.state.winOpen = true
        this.setState(this.state)
      } else {
        this.props.history.push(
          createLocation('/type0', {
            from: nn
          })
        )
      }
    } else {
      console.error(orderRes.error_msg)
    }
  }

  change = (e) => {
    var index = e.currentTarget.dataset.id;
    this.setState({
      isActive: index
    })
    this.intoPay(this.props.App.state.paymentConfig.payments[index]);
  }

  intoPay = (payments: PaymentChannel) => {

    var pageName

    if (payments.showProductList === 1) { // 存在商品列表
      this.state.paymentDatas['typelist'] = payments
      this.props.history.push(
        createLocation('typeList')
      )
    } else {
      if (payments.showMethod === 0) { // 直接下单
        SDK.Ordering(payments)
          .then((orderRes: OrderRes) => {
            this.orderCompleted(orderRes, payments)
          })
      } else {
        pageName = 'type' + payments.showMethod
        this.state.paymentDatas[payments.showMethod] = payments
        this.props.history.push(
          createLocation(pageName)
        )
      }
    }
  }

  render() {
    return <div className="payment">
      <div className="payments">
        <div className="wrap"></div>
        <div className="wrap-payment">
          <div className="pay-header">
            <a className='back' style={{
              visibility: this.props.history.location.pathname === '/main' ? 'hidden' : 'visible'
            }}
              onClick={() => {
                this.props.history.goBack()
              }}
            >
            </a>
            <h2>{SDK.config.i18n.PayCenter}</h2>
            <a
              onClick={this.props.App.hidePayment}
              className="close">
            </a>
          </div>

          <div className={(() => {
            var className = "payment-content"
            switch (this.props.history.location.pathname) {
              case '/type0':
                className += ' type0'
                break
            }
            return className
          })()}>
            <Switch>
              <Route exact path='/typeList' render={() => <TypeList Payment={this} />} />
              <Route exact path='/type0' render={({ history }) => <Type0 Payment={this} history={history} />} />
              <Route exact path='/type1' render={() => <Type1 Payment={this} />} />
              <Route exact path='/type3' render={() => <Type3 Payment={this} />} />
              <Route exact path='/type4' render={() => <Type4 Payment={this} />} />
              <Route exact path='/type5' render={() => <Type5 Payment={this} />} />
              <Route path="/main" render={() => <ul className="payment-nav">
                {
                  this.props.App.state.paymentConfig.payments.map((node, index) => {
                    return <li key={index} data-id={index}
                      className={this.state.isActive == index ? "active" : ""}
                      onClick={(e) => this.change(e)}
                    >
                      <p>{node.name}</p>
                      <span></span>
                    </li>
                  })
                }
              </ul>} />
            </Switch>
          </div>
          {this.state.winOpen && <WinOpen parent={this} />}
        </div>
      </div>
    </div >
  }



}