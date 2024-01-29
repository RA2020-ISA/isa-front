import { Contract } from './../model/contract.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  contracts: Contract[] = [];
  displayedColumns: string[] = ['id', 'type', 'quantity', 'date', 'valid'];

  constructor() { }

  ngOnInit(): void {
    
  }

}