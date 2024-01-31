import { Component, OnInit } from '@angular/core';
import { Contract } from '../model/contract.model';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-all-contracts',
  templateUrl: './all-contracts.component.html',
  styleUrl: './all-contracts.component.css',
})
export class AllContractsComponent implements OnInit {
  contracts: Contract[] = [];
  displayedColumns: string[] = ['type', 'quantity', 'date', 'cancel', 'start'];

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    //this.loadContracts();   
    
    const myContract: Contract = {
      id: 1,
      type: 'Regular',
      quantity: 10,
      date: new Date('2022-12-31'), // Postavite datum prema potrebi
      valid: true
    };

    this.contracts.push(myContract);
  }

  loadContracts(): void {
    this.contractService.getContracts().subscribe(
      (data: any) => {
        this.contracts = data;
      },
      (error: any) => {
        console.error('Error fetching contracts:', error);
      }
    );
  }

  cancelContract(contractId: number) {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (!contract || !contract.date) {
      console.error('Contract not found or date is undefined.');
      return;
    }

    const isValidDate = new Date(contract.date);

    const currentTimestamp = Date.now();
    const currentDate = new Date(currentTimestamp);
    const diff = Math.abs(isValidDate.getTime() - currentDate.getTime());
    const differenceInDays = diff / (1000 * 60 * 60 * 24);

    if (differenceInDays <= 3) {
      alert('It cannot be canceled, the deadline has passed');
      return;
    }
    this.contractService.updateContract(contractId, contract).subscribe(
      (data: any) => {
        this.loadContracts();
      },
      (error: any) => {
        console.error('Error fetching contracts:', error);
      }
    );
  }

  startDelivery() {
    this.contractService.startDelivery().subscribe(
      (data: any) => {
        console.log("Uspesno poslato");
      }, 
      (error: any) => {
        console.error("Error starting delivery: ", error);
      }
    )
  }
}