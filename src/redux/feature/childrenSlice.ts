import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Child {
  id: number;
  full_name: string;
  date_of_birth: string;
  gender: string;
  interests?: string;
  communication_level?: string;
  profile_image?: string;
  created_at?: string;
}

interface ChildrenState {
  children: Child[];
  selectedChild: Child | null;
}

const initialState: ChildrenState = {
  children: [],
  selectedChild: null,
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload;
    },
    setSelectedChild: (state, action: PayloadAction<Child | null>) => {
      state.selectedChild = action.payload;
    },
    clearChildrenData: (state) => {
      state.children = [];
      state.selectedChild = null;
    },
  },
});

export const { setChildren, setSelectedChild, clearChildrenData } = childrenSlice.actions;
export default childrenSlice.reducer;
