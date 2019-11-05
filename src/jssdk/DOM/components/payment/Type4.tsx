
import './Type4.scss'
import * as React from 'react'
import Payment from './index'
import { createLocation } from 'history'


type paymentProps = {
  Payment: Payment
}


export default class Type4 extends React.Component<paymentProps, {}, any>  {

  private index = 4

  render() {
    return <div className="payment-nav">
      <h2 className="name">
        {this.props.Payment.state.paymentDatas[this.index].name}
      </h2>
      <ul className="cards">
        {
          this.props.Payment.state.paymentDatas[this.index].nodes.map((node, i) => (
            <li key={i} data-id={i}
              onClick={() => {
                if (this.props.Payment.state.paymentDatas[this.index].nodes[i].showMethod === 2) {
                  this.props.Payment.intoPay(this.props.Payment.state.paymentDatas[this.index].nodes[i])
                } else {
                  RG.jssdk.Ordering(node).then((OrderRes: OrderRes) => {
                    if (OrderRes.code === 200) {
                      this.props.Payment.state.paymentDatas[0] = OrderRes.data
                      this.props.Payment.props.history.push(createLocation('/type0'))
                    } else {
                      console.error(OrderRes.error_msg)
                    }
                  })
                }

              }}>
              <img src={
                node.codeImg.replace(/http\:\/{0,2}/, 'https://').replace(/:[0-9]+/, '')
              } />
            </li>
          ))
        }
      </ul>
    </div>
  }

}
